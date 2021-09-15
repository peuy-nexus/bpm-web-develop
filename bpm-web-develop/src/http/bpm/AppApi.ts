import ApiClient from "@/http/ApiClient";
import StringUtil from "@/components/waltz-vue/utils/StringUtil";

export default class AppApi {
  /**
   * 获取上传签名
   */
  static getSystemConfig(): Promise<any> {
    return ApiClient.server()
      .get(`v1/app/config`)
      .then(res => {
        return res.data;
      });
  }
}
