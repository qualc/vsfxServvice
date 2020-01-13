import { Controller, Get, Post } from 'vsfx';
import { doFormidable } from '../../../lib/upload';
import { PictureService } from '../../../service/function/picture';
import { Picture } from '../../../entity/picture';
const pictureService = new PictureService();
@Controller('/picture')
export class PictureController {
    @Post('/upload')
    async uploadPicture(req, res) {
        try {
            let { fileUrl, fileName, used, status = 1, errmsg = '上次图片失败' } = await doFormidable(req, {
                type: 'images',
                reg: /^.*\.(?:jpg|png|jpeg)$/i
            });
            if (status != 1) {
                console.log(errmsg, status);
                return res.sendError(errmsg, status);
            }
            let picture: Picture = {
                imgUrl: <string>fileUrl,
                alt: (<string>fileName).replace(/(\.[^\.]+)$/, ''),
                name: <string>fileName,
                used: used == 'true' ? 1 : 0
            };
            picture.imgUrl = <string>fileUrl;
            pictureService.saveOrUpdateAny(Picture, picture);
            res.sendSuccess(fileUrl);
        } catch (e) {
            console.log(e);
        }
    }

    @Get('/all')
    async getAllPicture({ query }, res) {
        let { name, used, vague = false, noPage = false, pageSize = 20, currPage = 1 } = query;
        if (vague && name) {
            name = this.vagueHandle(name);
        }
        let { pictureList, total } = await pictureService.getAll({ name, used, vague, noPage, pageSize, currPage });
        res.sendSuccess({ pictureList, total });
    }
    vagueHandle(str) {
        let len = str.length,
            keywords = Array<string>();
        if (len <= 2) return [str];
        len = len < 3 ? 2 : Math.ceil(len / 2);
        function gen(arr, len) {
            if ((arr.length = len)) {
                keywords.push(arr.join(''));
            } else if (arr.length > len) {
                let temp = [arr.shift()],
                    i = 0;
                while (len - 1 > i) {
                    temp.push(arr[i++]);
                }
                keywords.push(temp.join(''));
                gen(arr, len);
            }
        }
        gen(str.split(''), len);
        return keywords;
    }
}
