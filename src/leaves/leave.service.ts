import { leaveType } from "./leave.controller";
import leaveModel from "./leave.model";

class LeaveService {
  private static leaveService: LeaveService;

  constructor() {}

  static getInstance() {
    if (!this.leaveService) {
      this.leaveService = new LeaveService();
    }
    return this.leaveService;
  }

  async createLeave(data: leaveType) {
    try {
      await leaveModel.create({ ...data });
    } catch (err: any) {
      throw new Error(err.message);
    }
  }

  async getLeaves() {
    try {
      const leaves = await leaveModel.find();
      return leaves;
    } catch (err: any) {
      throw new Error(err.message);
    }
  }

  async getLeave(id: string) {
    try {
      const leaves = await leaveModel.findById(id);
      return leaves;
    } catch (err: any) {
      throw new Error(err.message);
    }
  }

  async deleteLeave(id: string) {
    try {
      await leaveModel.findByIdAndDelete(id);
    } catch (err: any) {
      throw new Error(err.message);
    }
  }
}

export default LeaveService.getInstance();
