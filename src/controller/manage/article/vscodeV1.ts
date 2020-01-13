import { Controller, Get, Post } from 'vsfx';

import { isEmpty, isNotInteger, isFalse, isInteger, isNotEmpty } from '../../../lib/validate';
import { Format } from '../../../lib/format';
import Crypto from '../../../lib/crypto';
import { ArticleService } from '../../../service/article/article';
import { UsersService } from '../../../service/users/users';
import { UsersInterfaceService } from '../../../service/users/usersInterface';
import { Article } from '../../../entity/article';
import { ArticleType } from '../../../entity/articleType';
import { Users } from '../../../entity/users';
import { ArticleTypeService } from '../../../service/article/articleType';
import { ArticleSeriesService } from '../../../service/article/articleSeries';
import { ArticleSeries } from 'entity/articleSeries';
import * as fs from 'fs';

const articleService = new ArticleService();
const usersService = new UsersService();
const articleTypeService = new ArticleTypeService();
const articleSeriesService = new ArticleSeriesService();
const usersInterfaceService = new UsersInterfaceService();

const h1Reg = /<h1[^>]*>([^<]+)<\/h1>/;
const h2SeriesReg = /<h2[^>]*>@Ser:([^<]+)<\/h2>/;
const pDescriptReg = /<p>@Der:([^<]*)<\/p>/;
const titleReg = /(.*)\-(.*)$/;

type ARTICLE = {
    id?: number;
    title: string;
    articleType: string;
    content: string;
    disabled: number;
    docreader: string | null;
    publishDate: string;
    type: number;
    seriesName?: string;
};
/**
 * 文章controller
 *
 * @export
 * @class ArticleController
 */
export class ArticleController {
    // 保存文章
    @Post('/savea')
    async saveArticleInfo(req, res, next) {
        console.log(req.body);
        let {
            body: { content, id }
        } = req;
        let loginUsers = await this.checkUserInfo(req, res, next);
        if (!loginUsers) {
            return next();
        }

        let article = <Article>{};
        let [htext, title] = content.match(h1Reg) || [null, null];
        if (!htext || !title) {
            return res.sendError('标题不存在，格式为 `#标题-类型`');
        }
        let titleMatch = title.match(titleReg);
        article.title = titleMatch && titleMatch[1];
        let aceType = titleMatch && titleMatch[2];
        if (!article.title || !aceType) {
            return res.sendError('标题格式不正确，格式为 `#标题-类型`' + article.title);
        }
        let typeId = await this.checkArticleType(res, aceType);
        if (!typeId) {
            return next();
        } else {
            let articleType = <ArticleType>{};
            articleType.id = <number>typeId;
            articleType.name = aceType;
            article.articleType = articleType;
        }

        let seriesMatch = content.match(h2SeriesReg);
        let seriesName = '';
        if (seriesMatch && seriesMatch[1]) {
            seriesName = seriesMatch[1];
        }
        let seriesId = await this.checkArticleSeries(res, seriesName);
        if (!seriesId) {
            return next();
        } else if (seriesId != true) {
            let articleSeries = <ArticleSeries>{};
            articleSeries.id = seriesId;
            article.articleSeries = articleSeries;
        }

        let descriptMatch = content.match(pDescriptReg);
        if (descriptMatch && descriptMatch[1]) {
            article.docreader = descriptMatch[1];
        }
        // 去掉了h1的内容
        article.content = content.replace(htext, '');

        if (isNotEmpty(id)) {
            if (isInteger(id)) {
                article.id = id;
            } else {
                return res.sendError('id入参类型异常');
            }
        }
        if (isEmpty(article.title) || article.title.length > 50) {
            return res.sendError('标题长度必须为1-50个字符');
        }
        if (isEmpty(article.content)) {
            return res.sendError('内容不能为空');
        }
        // if (isNotInteger(body.articleTypeId)) {
        //     return res.sendError('articleTypeId类型异常');
        // }
        let users = <Users>{};
        try {
            users.id = loginUsers.id;
        } catch (e) {
            users.id = 2;
        }
        article.users = users;
        // Object.assign(article, Only(body, ['title', 'content', 'pricture', 'docreader', 'labelId', 'publishDate', 'type']))

        if (article.type == 1) {
            if (isEmpty(article.picture)) {
                // return res.sendError('题图不能为空');
            }
        }
        let nowTime = Format.date(new Date(), 'yyyy-MM-dd hh:mm:ss');
        if (!article.publishDate) {
            article.publishDate = nowTime;
        }
        if (!article.id) {
            article.createDate = nowTime;
        }
        article.picture = '';
        let lastId = await articleService.saveOrUpdateAndGetId(article);
        content = this.appendMeta(content, nowTime, aceType, seriesName, htext);
        fs.writeFile(`/data/web_tbwork_static/html/${lastId}.html`, content, function(err) {
            if (err) {
                console.log('生成文件失败' + err.message);
                return;
            }
            console.log('生成文件成功');
        });
        res.sendSuccess({ lastId, msg: '发布成功' });
    }
    // 插入文章meta
    appendMeta(content: string, time: string, type: string, series: string, htext: string): string {
        let styles = `
            <style>
                .__sf-articleinfo-meta{
                    margin-top: 10px;
                    font-size: 12px;
                    font-family: 'Lato', "PingFang SC", "Microsoft YaHei", sans-serif;
                    color: #999;
                }
                .__sf-articleinfo-meta .__sf-articleinfo-meta-item:after{
                    content: '|';
                    display: inline-block;
                    margin: 0 5px;
                }
            <style>
        `;
        // 请求一个图片，返回阅读量
        let metas = `<div class="__sf-articleinfo-meta">
            <span class="__sf-articleinfo-meta-item">发表于：${time}</span>
            <span class="__sf-articleinfo-meta-item">分类：${type}</span>
            <span class="__sf-articleinfo-meta-item" style="display:none">阅读次数：<span id="visitors"></span></span></div>`;
        let invalidStr = '-' + type + (series ? '-' + series : series);
        let title = htext.replace(invalidStr, '');
        content = content.replace(htext, `${styles}${title}${metas}`);
        return content;
    }
    // 验证用户登陆
    async checkUserInfo(req, res, next) {
        let {
            body: {
                users: { email, password: upass }
            }
        } = req;
        if (isEmpty(email)) {
            res.sendError('邮箱地址不能为空');
            return false;
            // return '邮箱地址不能为空';
        }
        var users = await usersService.getUsersLogin({ email });
        if (users.id) {
            let { password } = users;
            password = Crypto.aesDecryptPipe(password);
            if (password != upass) {
                res.sendError('用户名或密码不正确');
                return false;
                // return '用户名或密码不正确';
            }
        } else {
            res.sendError('用户名不存在');
            return false;
            // return '用户名不存在'
        }
        try {
            let interfaceList = await usersInterfaceService.getInterfaceListByRoleId(users.usersRoleId);
            let interUrl = req.baseUrl + req.route.path;
            let _interceptor = interfaceList.some(item => interUrl == item.interfaceUri);
            // url不在menu列表中
            if (!_interceptor) {
                res.sendError('暂无访问权限', 996);
                return false;
            }
        } catch (e) {
            console.log('登录获取权限失败:' + e.message);
            res.sendError('获取权限失败', 996);
            return false;
        }
        return users;
    }
    // 验证文章类型
    async checkArticleType(res, articleType): Promise<number | boolean> {
        if (!articleType) {
            res.sendError('文章类型不能为空');
            return false;
        }
        let { id: typeId } = await articleTypeService.findOneByTypeName(articleType);
        if (!typeId) {
            let typesList = await articleTypeService.findByTypeName(articleType);
            if (typesList.length > 0) {
                let types = typesList.map((item: ArticleType) => item.name);
                res.sendError('类型不存在，找到相似类型有: ' + types.join());
            } else {
                res.sendError('类型不存在');
            }
            return false;
        }
        return typeId;
    }
    // 验证文章系列
    async checkArticleSeries(res, seriesName): Promise<number | boolean> {
        if (!seriesName) {
            return true;
        }
        let seriesId = await articleSeriesService.findIdBySeriesName(seriesName);
        if (!seriesId) {
            let seriesList = await articleSeriesService.findBySeriesName(seriesName);
            if (seriesList.length > 0) {
                let series = seriesList.map((item: ArticleSeries) => item.name);
                res.sendError('系列不存在，找到相似系列有: ' + series.join());
            } else {
                res.sendError('系列不存在');
            }
            return false;
        }
        return seriesId;
    }
    // 保存文章类型
    @Post('/savet')
    async saveArticleTypeInfo({ body, users }, res) {
        var articleType = <ArticleType>{};
        if (isNotEmpty(body.id)) {
            if (isInteger(body.id)) {
                articleType.id = body.id;
            } else {
                return res.sendError('id入参类型异常');
            }
        }
        if (isEmpty(body.name) || body.name.length > 25) {
            return res.sendError('类型标题长度必须为1-25个字符');
        }
        articleType.name = body.name;
        res.sendSuccess(await articleTypeService.saveOrUpdateArticleType(articleType));
    }
    // 保存文章系列
    @Post('/saves')
    async saveArticleSeriesInfo({ body, users }, res) {
        var articleSeries = <ArticleSeries>{};
        if (isNotEmpty(body.id)) {
            if (isInteger(body.id)) {
                articleSeries.id = body.id;
            } else {
                return res.sendError('id入参类型异常');
            }
        }
        if (isEmpty(body.name) || body.name.length > 25) {
            return res.sendError('系列标题长度必须为1-25个字符');
        }
        articleSeries.name = body.name;
        res.sendSuccess(await articleSeriesService.saveOrUpdateArticleSeries(articleSeries));
    }
}
