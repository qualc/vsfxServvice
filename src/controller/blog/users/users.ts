import { Controller, Get } from 'vsfx';
import { isNotInteger, isEmpty } from '../../../lib/validate';
import { UsersService } from '../../../service/users/users';
import { Users } from '../../../entity/users';
const usersService = new UsersService();
@Controller('/users')
export class UsersController {
    @Get('/findOne/:id')
    async findOneById({ params: { id } }, res) {
        if (isNotInteger(+id)) {
            return res.sendError('入参类型错误');
        }
        res.sendSuccess(await usersService.getUsersById(id));
    }
    @Get('/findOneByIdentity/:identity?')
    async findOneByIdentity({ query: { identity } }, res) {
        if (isEmpty(identity)) {
            return res.sendError('作者标识不能为空');
        }
        let users: Users = await await usersService.getUsersByIdentity(identity);
        if (users.id) {
            res.sendSuccess(users);
        } else {
            res.sendError('无效的作者标识');
        }
    }
    @Get('/findAuthorList')
    async getAuthorList(req, res, next) {
        res.sendSuccess(await usersService.getAuthorList());
    }
}
