import ApiClient from "@/http/ApiClient";

export default class RoleApi {
  /**
   * 流程定义列表
   */
  static query(body: any): Promise<any> {
    return ApiClient.server()
      .post(`/v1/identity/role/delete`, body)
      .then(res => {
        return res.data;
      });
  }
}
