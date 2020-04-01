import { Service } from 'vsfx';
import { BaseService } from '../BaseService';

/**
 *
 *
 * @export
 * @class TableService
 */
@Service()
export class TableService extends BaseService {
    async getTables() {
        return this.getManager().query('select table_name as label, table_name as id from INFORMATION_SCHEMA.TABLES where TABLE_SCHEMA = "sf"');
    }
    async getTableInfoByName(tableName) {
        return this.getManager().query(`select COLUMN_COMMENT as comment, COLUMN_NAME as name, IS_NULLABLE as isNull, COLUMN_TYPE as type from INFORMATION_SCHEMA.COLUMNS where TABLE_SCHEMA = 'sf' and table_name = '${tableName}'`);
    }
    async checkTableExists(tableName) {
        return this.getManager().query(`show tables like '${tableName}'`);
    }
}
