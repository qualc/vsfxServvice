import { Controller, Get } from 'vsfx';
import { isNotInteger } from '../../../lib/validate';
import { TableService } from '../../../service/database';

/**
 *@author
 */
@Controller('/table', {
    interceptors: false
})
export class TableController {
    tableService: TableService;
    constructor() {
        this.tableService = new TableService();
    }
    @Get('/list')
    async gettableList(req, res, next) {
        try {
            return res.sendSuccess(await this.tableService.getTables());
        } catch (e) {
            return res.sendError(e);
        }
    }
    @Get('/info/:tableName')
    async getTableInfo({ params }, res, next) {
        try {
            const tableName = params.tableName;
            if (!tableName) {
                return res.sendError('请输入表名');
            }
            const existss = await this.tableService.checkTableExists(tableName);

            if (!existss.length) {
                return res.sendError('无效的表名');
            }
            return res.sendSuccess(await this.tableService.getTableInfoByName(tableName));
        } catch (e) {
            return res.sendError(e);
        }
    }
}
