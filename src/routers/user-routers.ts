import { Router } from 'express'
import { Request, Response } from 'express-serve-static-core'
import { Repository } from 'typeorm/repository/Repository'
import { User } from '~/models/entities/User'

export class UserRouter {
    public router: Router = Router()
    private readonly userRepository: Repository<User>

    constructor(userRepository: Repository<User>) {
        this.userRepository = userRepository
        this.router.get('*', this.get)
    }

    private get = async (req: Request, res: Response) => {
        const user = User.create({
            firstName: 'Ryan',
            lastName: 'King',
            age: 32,
        })

        const result = await this.userRepository.save(user)
        res.json(result)
    }
}
