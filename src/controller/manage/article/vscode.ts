import { exec, spawn } from 'child_process';
import { Controller, Get, Post, Interceptors } from 'vsfx';

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
import { ArticleSeries } from '../../../entity/articleSeries';
import Render from '../../../lib/render';

const articleService = new ArticleService();
const usersService = new UsersService();
const articleTypeService = new ArticleTypeService();
const articleSeriesService = new ArticleSeriesService();
const usersInterfaceService = new UsersInterfaceService();

const titleReg = /^\s*# ?(.+)/;
const descriReg = /^#[^\n\r]+\s+(\>|\&gt;)([^#]+)/;
// const typeReg = /## ?\@T\: *(.*)/;
// const SeriesReg = /## ?\@S\: *(.*)/;
// const descriptReg = /\> ?@D: *(.*)/;
// const descriReg = /\n?\>([^\n]*)/; // /\<\/h1\>\s*\<blockquote\>([\s\S\n]*)\<\/blockquote\>.*/; // 紧跟着一级标题的段落
/**
 * 文章controller
 *
 * @export
 * @class ArticleController
 */
@Controller('/vsarticle')
@Interceptors(false)
export class ArticleController {
    // 保存文章
    @Post('/savea')
    async saveArticleInfo(req, res, next) {
        let {
            body: { content, id, articleType = '', type = 1, picture }
        } = req;
        // let loginUsers = await util.checkUserInfo(req, res, next);
        // if (!loginUsers) {
        //   return;
        // }
        const loginUsers = req.users;
        if (id) {
            let articleId = await this.checkArticleInfo(req, res, next);
            if (!articleId) {
                return res.sendError('文章不存在，请删除本地id重新发布');
            }
        }
        let article = <Article>{};
        article.coding = 2;
        // # 这是标题 => ['# 这是标题', '这是标题']
        let [htext, title] = content.match(titleReg) || [null, null];
        if (!htext || !title) {
            return res.sendError('标题不存在，格式为 `# 标题`');
        }
        article.title = title;

        // ## @T:这是types => ['## @T:这是types', '这是types']
        // let [htype, type] = content.match(typeReg) || [null, null];
        // if (!article.title || !type) {
        //     return res.sendError('类型不存在，格式为 `## @T:类型`');
        // }
        // let { typeId, iconUrl } = await this.checkArticleType(res, type);
        // if (!typeId) {
        //     return;
        // } else {
        //     let articleType = <ArticleType>{};
        //     articleType.id = <number>typeId;
        //     articleType.name = type;
        //     article.articleType = articleType;
        // }

        if (!articleType) {
            return res.sendError('类型不能空');
        }
        let _articleType = <ArticleType>{};
        _articleType.id = articleType.id;
        _articleType.name = articleType.label;
        article.articleType = _articleType;
        if (picture) {
            article.picture = picture; // || articleType.iconUrl;
        }
        // ## @S:这是series => ['## @S:这是series', '这是series']
        // let [hseries, seriesName = ''] = content.match(SeriesReg) || [null, null];
        // let seriesId = await this.checkArticleSeries(res, seriesName);
        // if (!seriesId) {
        //     return;
        // } else if (seriesId != true) {
        //     let articleSeries = <ArticleSeries>{};
        //     articleSeries.id = seriesId;
        //     article.articleSeries = articleSeries;
        // }

        // > @D:这是标题 => ['> @D:这是标题', '这是标题']
        // let [hdesc, docreader] = content.match(descriptReg) || [null, null];
        // if (docreader) {
        //     article.docreader = docreader;
        // }

        let [hdesc, tag, docreader] = content.match(descriReg) || [null, null, null];
        if (docreader) {
            // article.docreader = docreader.replace(/(\<[^>]*\>)/g, '');
            article.docreader = docreader
                .split('>')
                .map(item => {
                    return item.replace(/^\s|\s$/g, '') + '</br/>';
                })
                .join('');
        }
        // content = content.replace(descriptReg, '> ' + docreader);
        // 去掉了h1的内容
        // article.content = content.replace(htext, '');//.replace(hseries, '').replace(hdesc, '');
        article.content = content;
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
        if (!article.picture) {
            // ![2019-09-09-15-24-11.png](http://static.qualc.cn/images/upload_e87e46497e6c783d38e65f8b00c1213e.png)
            const [, picture] = content.match(/\!\[[\d\-\.a-z]+\]\((https?:\/\/static\.qualc\.cn\/images\/[^\)]+)\)/) || ['', ''];
            if (picture) {
                article.picture = picture;
            }
        }
        if (article.type == 1) {
            if (isEmpty(article.picture)) {
                // return res.sendError('题图不能为空');
            }
        }
        let _date = new Date();
        _date.setHours(8);
        let nowTime = Format.date(_date, 'yyyy-MM-dd hh:mm:ss');
        if (!article.publishDate) {
            article.publishDate = nowTime;
        }
        if (!article.id) {
            article.createDate = nowTime;
        }
        // 默认文章

        article.type = type;
        let lastId = await articleService.saveOrUpdateAndGetId(article);
        // 添加访问记录接口
        content += `<img src="http://blog.qualc.cn/restapi/article/visitors.jpg?id=${lastId}" style="display: none">`;

        // content = this.appendMeta(content, nowTime, type, series, htext);
        // 落地资讯
        Render(lastId, title, content);
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
    // 如果id存在时， 验证文章是否存在
    async checkArticleInfo(req, res, next) {
        let {
            body: { id }
        } = req;
        let article = await articleService.getArticleInfoById(id);
        return article ? article.id : null;
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

    /**
     * 获取类型列表
     * @param req
     * @param res
     */
    @Get('/findt')
    async findArticleTypeList(req, res) {
        // return res.sendSuccess([{ label: ' test', id: 1, iconUrl: '' }]);
        res.sendSuccess(await articleTypeService.findAllToVs());
    }

    /**
     * 获取类型列表
     * @param req
     * @param res
     */
    @Get('/checktiem/:id/:time')
    async checkArticleTiem(req, res) {
        let { time, id } = req.params;
        let article = await articleService.getArticleInfoById(id);
        if (!article || !article.id) {
            return res.sendError('该资讯不存在， 请删除本地id重新发布');
        }
        let publishDate = new Date(article.publishDate).getTime();

        return res.sendSuccess({ article, isNew: publishDate > +time });
        return article ? article.id : null;
    }

    /**
     *
     * @param req 更新文章
     * @param res
     */
    @Get('/pull/:id')
    async pullArticleInfo({ params }, res) {
        let { id } = params;
        let article = await articleService.getArticleInfoById(id);
        if (!article || !article.id) {
            return res.sendError('该资讯不存在， 请删除本地id重新发布');
        }
        res.sendSuccess(article);
    }

    @Get('/delete/:id')
    async deleteArticle({ params }, res) {
        let { id } = params;
        if (isNotInteger(id)) {
            return res.sendError('入参类型错误');
        }
        if (isFalse(id)) {
            return res.sendError('id不能为空');
        }
        res.sendSuccess(await articleService.deletedArticle(id));
    }

    @Get('/reload', {
        interceptors: true
    })
    async reloadService(req, res, next) {
        const loginUsers = req.users;
        if (loginUsers.email != '493549174@qq.com') {
            res.sendError('无权部署');
            return;
        }
        spawn('git');
        // 强制覆盖本地代码，与git远程仓库保持一致
        exec('git pull', (error, stdout, stderr) => {
            if (error) {
                res.sendError('拉取代码异常，请手动部署' + error.stack, 100);
                return;
            }
            exec('npm run build', (error, stdout, stderr) => {
                if (error) {
                    res.sendError('编译代码异常，请手动部署' + error.stack, 100);
                    return;
                }
                exec('pm2 reload server', (error, stdout, stderr) => {
                    if (error) {
                        res.sendError('pm2 reload 异常，请手动部署' + error.stack, 100);
                        return;
                    }
                });
            });
        });
    }
}

const util = {
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
    },
    // 验证文章类型
    async checkArticleType(res, articleType): Promise<any> {
        if (!articleType) {
            res.sendError('文章类型不能为空');
            return false;
        }
        let { id: typeId = 0, iconUrl } = await articleTypeService.findOneByTypeName(articleType);
        if (!typeId) {
            let typesList = await articleTypeService.findByTypeName(articleType);
            if (typesList.length > 0) {
                let types = typesList.map((item: ArticleType) => item.name);
                res.sendSuccess(types, 2, '类型不存在,请重新选择或新增');
            } else {
                res.sendError('类型不存在');
            }
            return false;
        }
        return { typeId, iconUrl };
    },
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
};
