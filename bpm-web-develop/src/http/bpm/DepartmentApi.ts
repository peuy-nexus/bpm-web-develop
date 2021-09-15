import ApiClient from "@/http/ApiClient";

export default class DepartmentApi {
  /**
   * 流程定义列表
   */
  static query(body: any): Promise<any> {
    return ApiClient.server()
      .post(`/v1/identity/department/query`, body)
      .then(res => {
        return res.data;
      });
  }
}
