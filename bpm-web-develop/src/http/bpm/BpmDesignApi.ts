import ApiClient from "@/http/ApiClient";

export default class BpmDesignApi {
  /**
   * 流程定义列表
   * @param body
   */
  static get(body: any): Promise<any> {
    return ApiClient.server()
      .post(`/v1/design/get`, body, {})
      .then(res => {
        return res.data;
      });
  }

  static modify(body: any): Promise<any> {
    return ApiClient.server()
      .post(`/v1/design/modify`, body, {})
      .then(res => {
        return res.data;
      });
  }
}
