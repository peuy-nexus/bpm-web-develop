import ApiClient from "@/http/ApiClient";

export default class UserTaskApi {
  static queryTodo(body: any): Promise<any> {
    return ApiClient.server()
      .post(`/v1/usertask/querytodo`, body)
      .then(res => {
        return res.data;
      });
  }

  static countTodo(body: any): Promise<any> {
    return ApiClient.server()
      .post(`/v1/usertask/counttodo`, body)
      .then(res => {
        return res.data;
      });
  }
}
