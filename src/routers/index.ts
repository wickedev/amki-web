import { Router } from 'express'
import { UserRouter } from '~/routers/user-routers'

export class APIRouter {
    public router: Router = Router()

    constructor(userRouter: UserRouter) {
        this.router.all('/user', userRouter.router)
    }
}
