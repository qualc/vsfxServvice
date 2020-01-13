import { Controller, Get, Post } from 'vsfx';
import { AccountService } from '../../../service/account/account';
/**
 * 记账controller
 *
 * @export
 * @class AccountController
 */
const accountService = new AccountService();
@Controller('/account')
export class AccountController {
    @Post('/save')
    async saveAccountInfo({ body }, res) {
        const enums = ['', '买菜', '挥霍', '交通', '生病', '工资', '奖金', '节日', '其他'];
        try {
            let { type, price, createTime, IAE, description = '' } = body;
            type = enums.findIndex(item => type === item);
            if (!type || !price || !IAE) {
                return res.sendError(`入参异常:${JSON.stringify(body)}`);
            }
            await accountService.save({ type, price, createTime, IAE, description });
            res.sendSuccess('ok');
        } catch (e) {
            res.sendError(e.stack);
        }
    }
    @Get('/list')
    async getAccountList(req, res) {
        try {
            res.sendSuccess(await accountService.getAccountList());
        } catch (e) {
            res.sendError(e.stack);
        }
    }
}
