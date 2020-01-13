type Structural = {
    id: number;
    disabled: number;
    name: string;
    article: Article;
};

import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from './BaseEntity';
import { Article } from './article';
@Entity('article_series')
export class ArticleSeries {
    constructor(props: Structural = <Structural>{}) {
        this.id = props.id;
        this.disabled = props.disabled;
        this.name = props.name;
        this.article = props.article;
    }
    @PrimaryGeneratedColumn()
    id: number;

    @Column('int', { default: 1, comment: '1可用，0禁用' })
    disabled: number;

    @Column('varchar', { length: 225, comment: '系列名称' })
    name: string;

    @OneToMany(
        type => Article,
        article => article.articleSeries
    )
    article: Article;
}
