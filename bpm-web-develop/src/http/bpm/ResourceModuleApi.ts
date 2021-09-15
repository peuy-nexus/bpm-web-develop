import ApiClient from "@/http/ApiClient";

export default class ResourceModuleApi {
  /**
   * 流程定义列表
   * @param body
   */
  static query(body: any): Promise<any> {
    return ApiClient.server()
      .post(`/v1/resource/module/query`, body)
      .then(res => {
        return res.data;
      });
  }

  static get(body: any): Promise<any> {
    return ApiClient.server()
      .post(`/v1/resource/module/get`, body)
      .then(res => {
        return res.data;
      });
  }
}
