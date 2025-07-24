import { logger } from "./application/logging";
import { web } from "./application/web";



web.listen(3000 , () => {
    logger.info('LISTENING ON PORT 3000')
} )