import ApiClient from "@/http/ApiClient";
import StringUtil from "@/components/waltz-vue/utils/StringUtil";

export default class OssApi {
  /**
   * 获取上传签名
   */
  static getSignature(data: any): Promise<any> {
    return ApiClient.server()
      .post(`sop/v1/{tenant}/oss/signature`, data, {})
      .then(res => {
        return res.data;
      });
  }

  static getImportTplUrl(key: any): Promise<any> {
    return ApiClient.server()
      .get(`sop/v1/{tenant}/oss/imptpl/url`, {
        params: {
          key: key,
        },
      })
      .then(res => {
        return res.data;
      });
  }

  /**
   *上传文件
   */
  static upload(file: any): Promise<any> {
    const formData = new FormData();
    formData.append("file", file);
    return ApiClient.server()
      .post(`/sop/v1/{tenant}/oss/file/upload`, formData, {
        headers: {
          "content-type": "multipart/form-data",
          fileId: StringUtil.uuid(),
        },
      })
      .then(res => {
        return res.data;
      });
  }

  /**
   * 上传进度
   */

  static getProgress(uuid: any): Promise<any> {
    return ApiClient.server()
      .post(`/{tenant}/job/detail/${uuid}`, {})
      .then(res => {
        return res.data;
      });
  }
}
