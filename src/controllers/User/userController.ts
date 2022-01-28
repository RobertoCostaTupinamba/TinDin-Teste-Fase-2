import { resUser, IUserPayload, UserService } from '../../services/userService';

export default class UserController {
  service = new UserService();

  public async login(payload: IUserPayload): Promise<resUser> {
    return this.service.authUser(payload);
  }
}
