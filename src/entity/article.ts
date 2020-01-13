type Structural = {
    title: string;
    users: Users;
    articleType: ArticleType;
    articleSeries: ArticleSeries;
    coding: number;
    docreader: string;
    publishDate: Date;
    picture: string;
    content: string;
    labelIds: string;
    praise: number;
    visitors: number;
    type: number;
};

import { Column, Entity, OneToOne, JoinColumn, OneToMany, ManyToOne } from 'typeorm';
import { BaseEntity } from './BaseEntity';
import { Users } from './users';
import { ArticleType } from './articleType';
import { ArticleSeries } from './articleSeries';
@Entity('article')
export class Article extends BaseEntity {
    constructor(props: Structural = <Structural>{}) {
        super();

        this.title = props.title;
        this.users = props.users;
        this.articleType = props.articleType;
        this.articleSeries = props.articleSeries;
        this.coding = props.coding;
        this.docreader = props.docreader;
        this.publishDate = props.publishDate;
        this.picture = props.picture;
        this.content = props.content;
        this.labelIds = props.labelIds;
        this.praise = props.praise;
        this.visitors = props.visitors;
        this.type = props.type;
    }
    @Column('varchar', { length: 225, comment: '标题' })
    title: string;

    @OneToOne(type => Users)
    @JoinColumn()
    users: Users;

    @OneToOne(type => ArticleType)
    @JoinColumn()
    articleType: ArticleType;

    @ManyToOne(
        type => ArticleSeries,
        articleSeries => articleSeries.article
    )
    articleSeries: ArticleSeries;

    @Column('int', { comment: '编码方式, 1 富文本  2 markdown', default: 1 })
    coding: number;

    @Column('varchar', { length: 255, comment: '概要', nullable: true, default: '' })
    docreader: string;

    @Column('datetime', { comment: '发布时间', nullable: true })
    publishDate: Date;

    @Column('varchar', { length: 255, comment: '文图', nullable: true })
    picture: string;

    @Column('blob', { comment: '内容' })
    content: string;

    @Column('varchar', { length: 2555, comment: '标签', nullable: true })
    labelIds: string;

    @Column('int', { comment: '赞', nullable: true, default: 0 })
    praise: number;

    @Column('int', { comment: '访问量', nullable: true, default: 0 })
    visitors: number;

    @Column('int', { comment: '1 文章 2是短记', nullable: true })
    type: number;
}
