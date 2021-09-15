import ApiClient from "@/http/ApiClient";
import StringUtil from "@/components/waltz-vue/utils/StringUtil";

export default class AppSystemApi {
  /**
   * 查询应用系统列表
   * @param body
   */
  static query(body: any): Promise<any> {
    return ApiClient.server()
      .post(`/v1/appsystem/query`, body)
      .then(res => {
        return res.data;
      });
  }

  /**
   * 新建应用系统
   * @param body
   */
  static create(body: any): Promise<any> {
    return ApiClient.server()
      .post(`/v1/appsystem/create`, body)
      .then(res => {
        return res.data;
      });
  }

  /**
   * 编辑应用系统
   * @param body
   */
  static modify(body: any): Promise<any> {
    return ApiClient.server()
      .post(`/v1/appsystem/modify`, body)
      .then(res => {
        return res.data;
      });
  }

  /**
   * 获取应用系统
   * @param body
   */
  static get(body: any): Promise<any> {
    return ApiClient.server()
      .post(`/v1/appsystem/modify`, body)
      .then(res => {
        return res.data;
      });
  }
}
