import { Controller, Get, Post } from 'vsfx';
import { isNotInteger, isEmpty, isFalse, isInteger, isNotEmpty } from '../../../lib/validate';
import { Format } from '../../../lib/format';
import { Only } from '../../../lib/only';
import { ArticleService } from '../../../service/article/article';
import { Article } from '../../../entity/article';
import { ArticleType } from '../../../entity/articleType';
import { Users } from '../../../entity/users';

import { ArticleSeries } from '../../../entity/articleSeries';
import { ArticleSeriesService } from '../../../service/article/articleSeries';

import Render from '../../../lib/render';

/**
 * 文章controller
 *
 * @export
 * @class ArticleController
 */
const articleService = new ArticleService();
const articleSeriesService = new ArticleSeriesService();
@Controller('/article')
export class ArticleController {
    /**
     * 获取文章列表
     *
     * @param {any} { query }
     * @param {any} res
     * @memberof ArticleController
     */
    @Post('/findAll')
    async findAllArticle({ body, users }, res) {
        let { articleTypeId, type, desabled, nickName, pageSize = 20, currPage = 1 } = body;
        if (articleTypeId && isNotInteger(articleTypeId)) {
            return res.sendError('分类id类型错误');
        }
        if (type && isNotInteger(type)) {
            return res.sendError('type类型错误');
        }
        if (articleTypeId && isNotInteger(desabled)) {
            return res.sendError('desabled类型错误');
        }
        if (isNotInteger(pageSize) && isNotInteger(currPage)) {
            return res.sendError('分页入参类型错误');
        }
        let usersId: number = 0;
        try {
            usersId = users.id;
        } catch (e) {
            return res.sendError('登陆态异常,请重新登陆');
        }
        if (!usersId) {
            return res.sendError('登陆态不存在,请重新登陆');
        }
        // res.sendSuccess(await ArticleService.getAnyAll('article', { column: ['id'], where: { disabled: 1, id: 2 } }))
        res.sendSuccess(
            await articleService.findAllArticle({
                usersId,
                articleTypeId,
                nickName,
                type,
                desabled,
                pageSize,
                currPage
            })
        );
    }

    /**
     * 根据id获取一篇文章
     *
     * @param {any} { params }
     * @param {any} res
     * @memberof ArticleController
     */
    @Get('/info/:id')
    async getArticleInfoById({ params: { id } }, res) {
        if (isNotInteger(+id)) {
            res.sendError('入参类型错误');
        } else {
            res.sendSuccess(await articleService.getArticleInfoById(id));
        }
    }

    @Post('/saveOrUpdate')
    // @Validation(ArticleCreateDto)
    async saveArticleInfo({ body, users }, res) {
        let article = <Article>{};
        if (isNotEmpty(body.id)) {
            if (isInteger(body.id)) {
                article.id = body.id;
            } else {
                return res.sendError('id入参类型异常');
            }
        }
        if (isEmpty(body.title) || body.title.length > 50) {
            return res.sendError('标题长度必须为1-50个字符');
        }
        if (isEmpty(body.content)) {
            return res.sendError('内容不能为空');
        }
        if (isNotInteger(body.articleTypeId)) {
            return res.sendError('articleTypeId类型异常');
        }
        let articleType = <ArticleType>{};
        articleType.id = body.articleTypeId;
        articleType.name = body.articleTypeName;
        try {
            users.id = users.id;
        } catch (e) {
            users.id = 2;
        }
        article.users = users;
        article.articleType = articleType;

        if (body.articleSeriesId) {
            let articleSeries = <ArticleSeries>{};
            articleSeries.id = body.articleSeriesId;
            if (body.articleSeriesName) articleSeries.name = body.articleSeriesName;
            article.articleSeries = articleSeries;
        }

        Object.assign(article, Only(body, ['title', 'content', 'pricture', 'docreader', 'labelId', 'publishDate', 'type']));

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
        if (!article.docreader) {
            return res.sendError('描述不能为空');
        }
        // if (!article.docreader || !article.docreader.replace(/\s/g, '')) {
        //     let docreader = article.content;
        //     docreader = docreader.replace(/(\&|\&)gt;/g, ">")
        //         .replace(/(\&|\&)lt;/g, "<")
        //         .replace(/(\&|\&)quot;/g, "\"");
        //     article.docreader = docreader.replace(/\<[^\>]+\>|\< ?\/[^\>]+\>/g, '').substr(0, 200);
        // }
        article.picture = body.picture;
        if (article.coding == 2) {
            let lastId = await articleService.saveOrUpdateAndGetId(article);
            Render(lastId, article.title, article.content);
            res.sendSuccess('发布成功');
        } else {
            res.sendSuccess(await articleService.saveOrUpdateArticle(article));
        }
    }

    @Get('/pulish')
    async pulishArticle({ query }, res) {
        let { id } = query;
        if (isNotInteger(id)) {
            return res.sendError('入参类型错误');
        }
        if (isFalse(id)) {
            return res.sendError('id不能为空');
        }
        res.sendSuccess(await articleService.publishArticle(id));
    }
    @Get('/disabled')
    async disabledArticle({ query }, res) {
        let { id } = query;
        if (isNotInteger(id)) {
            return res.sendError('入参类型错误');
        }
        if (isFalse(id)) {
            return res.sendError('id不能为空');
        }
        res.sendSuccess(await articleService.disabledArticle(id));
    }
    @Get('/delete')
    async deleteArticle({ query }, res) {
        let { id } = query;
        if (isNotInteger(id)) {
            return res.sendError('入参类型错误');
        }
        if (isFalse(id)) {
            return res.sendError('id不能为空');
        }
        res.sendSuccess(await articleService.deletedArticle(id));
    }
}
