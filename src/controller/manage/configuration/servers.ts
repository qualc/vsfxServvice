import { Controller, Get } from 'vsfx';
import Publish from '../../../lib/publish';
@Controller('/config/server')
export class ConfigServerController {
    @Get('/publish')
    publishServer(req, res, next) {
        Publish();
        res.send('ok:听天由命');
    }
}
