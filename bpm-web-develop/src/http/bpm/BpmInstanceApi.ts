import ApiClient from "@/http/ApiClient";

export default class BpmInstanceApi {
  /**
   * 流程实例列表
   * @param body
   */
  static query(body: any): Promise<any> {
    return ApiClient.server()
      .post(`/v1/instance/query`, body)
      .then(res => {
        return res.data;
      });
  }

  /**
   * 我发起的流程列表
   * @param body
   */
  static queryStarter(body: any): Promise<any> {
    return ApiClient.server()
      .post(`/v1/instance/query/started`, body)
      .then(res => {
        return res.data;
      });
  }

  /**
   * 我参与的流程列表
   * @param body
   */
  static queryJoined(body: any): Promise<any> {
    return ApiClient.server()
      .post(`/v1/instance/query/joined`, body)
      .then(res => {
        return res.data;
      });
  }

  static get(body: any): Promise<any> {
    return ApiClient.server()
      .post(`/v1/instance/get`, body)
      .then(res => {
        return res.data;
      });
  }

  /**
   * 发起流程
   */

  static start(body: any): Promise<any> {
    return ApiClient.server()
      .post(`/v1/instance/start`, body)
      .then(res => {
        return res.data;
      });
  }

  /**
   * 取消
   */

  static cancel(body: any): Promise<any> {
    return ApiClient.server()
      .post(`/v1/instance/cancel`, body)
      .then(res => {
        return res.data;
      });
  }

  /**
   * 删除
   */
  static delete(body: any): Promise<any> {
    return ApiClient.server()
      .post(`/v1/instance/delete`, body)
      .then(res => {
        return res.data;
      });
  }

  /**
   * 生成流程图
   */
  static diagram(body: any): Promise<any> {
    return ApiClient.server()
      .get(`/v1/instance/diagram`, body)
      .then(res => {
        return res.data;
      });
  }
}
