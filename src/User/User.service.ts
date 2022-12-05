import { userType } from "./User.controller";
import bcrypt from "bcrypt";
import Users from "./User.modal";

class UserService {
  private static userService: UserService;

  constructor() {}

  static getInstance() {
    if (!this.userService) {
      this.userService = new UserService();
    }
    return this.userService;
  }

  async getUsers() {
    try {
      const users = await Users.find();
      return users;
    } catch (err: any) {
      return err;
    }
  }

  async getUserById(id: string) {
    try {
      const users = Users.findById("638d7ff870300faecbab89f2");
      console.log(users);

      return users;
    } catch (err: any) {
      return err;
    }
  }

  async createUser(user: userType) {
    // userModel
    // call the user modal
    // save data in the DB
    // Return data base operation result to controller
    try {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(user.password, salt);
      await Users.create({
        name: user.name,
        email: user.email,
        password: hashedPassword,
      });
      return { error: false, message: "User Created Successfully!" };
    } catch (err: any) {
      return { error: true, message: err.message };
    }
  }

  updateUser() {}

  deleteUser() {}
}

export default UserService.getInstance();
