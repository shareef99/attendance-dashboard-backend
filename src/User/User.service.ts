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
      const user = await Users.findById(id);
      console.log(user);
      return user;
    } catch (err: any) {
      return err;
    }
  }

  async createUser(user: userType) {
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

  async updateUser(id: string, userData: userType) {
    try {
      const user = await Users.findByIdAndUpdate(id, {
        name: userData.name,
      });
      console.log(user);
      return { error: false, message: "User Updated Successfully" };
    } catch (err: any) {
      console.log(err);
      return { error: true, message: err.message };
    }
  }

  deleteUser(id: string) {}
}

export default UserService.getInstance();
