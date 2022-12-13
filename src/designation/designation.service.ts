import designationModel from "./designation.model";

class DesignationService {
  private static employeeService: DesignationService;

  constructor() {}

  static getInstance() {
    if (!this.employeeService) {
      this.employeeService = new DesignationService();
    }
    return this.employeeService;
  }

  async createDesignation(data: any) {
    try {
      await designationModel.create(data);
    } catch (err: any) {
      throw new Error(err.message);
    }
  }
}

export default DesignationService.getInstance();
