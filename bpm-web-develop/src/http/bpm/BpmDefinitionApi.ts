import ApiClient from "@/http/ApiClient";

export default class BpmDefinitionApi {
  /**
   * 流程定义列表
   * @param body
   */
  static query(body: any): Promise<any> {
    return ApiClient.server()
      .post(`/v1/definition/query`, body)
      .then(res => {
        return res.data;
      });
  }

  static get(body: any): Promise<any> {
    return ApiClient.server()
      .post(`/v1/definition/get`, body)
      .then(res => {
        return res.data;
      });
  }

  static create(body: any): Promise<any> {
    return ApiClient.server()
      .post(`/v1/definition/create`, body)
      .then(res => {
        return res.data;
      });
  }

  static update(body: any): Promise<any> {
    return ApiClient.server()
      .post(`/v1/definition/update`, body)
      .then(res => {
        return res.data;
      });
  }

  static enable(body: any): Promise<any> {
    return ApiClient.server()
      .post(
        `/v1/definition/enable`,
        {},
        {
          params: {
            uuid: body.uuid,
          },
        },
      )
      .then(res => {
        return res.data;
      });
  }

  static disable(body: any): Promise<any> {
    return ApiClient.server()
      .post(
        `/v1/definition/disable`,
        {},
        {
          params: {
            uuid: body.uuid,
          },
        },
      )
      .then(res => {
        return res.data;
      });
  }

  static setProcessStarters(body: any): Promise<any> {
    return ApiClient.server()
      .post(`/v1/definition/setstarters`, body)
      .then(res => {
        return res.data;
      });
  }

  static setUserTaskCandidates(body: any): Promise<any> {
    return ApiClient.server()
      .post(`/v1/definition/setusertaskcandidates`, body)
      .then(res => {
        return res.data;
      });
  }
}
