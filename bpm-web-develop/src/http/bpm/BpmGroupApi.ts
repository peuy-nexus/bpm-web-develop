import ApiClient from "@/http/ApiClient";

export default class BpmGroupApi {
  /**
   * 流程定义列表
   * @param body
   */
  static query(body: any): Promise<any> {
    return ApiClient.server()
      .post(`/v1/group/query`, body)
      .then(res => {
        return res.data;
      });
  }

  static create(data: any): Promise<any> {
    return ApiClient.server()
      .post(`/v1/group/create`, { name: data.name, upperUuid: !data.upper ? null : data.upper.uuid })
      .then(res => {
        return res.data;
      });
  }

  static modify(body: any): Promise<any> {
    return ApiClient.server()
      .post(`/v1/group/modify`, body)
      .then(res => {
        return res.data;
      });
  }

  static sort(body: any): Promise<any> {
    return ApiClient.server()
      .post(`/v1/group/sort`, body)
      .then(res => {
        return res.data;
      });
  }

  static delete(body: any): Promise<any> {
    return ApiClient.server()
      .post(`/v1/group/delete`, body)
      .then(res => {
        return res.data;
      });
  }
}
