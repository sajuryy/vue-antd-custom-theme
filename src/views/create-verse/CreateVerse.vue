<script setup lang="ts">
import { PlusOutlined, LoadingOutlined } from "@ant-design/icons-vue";
import { message } from "ant-design-vue";
import { defineComponent, ref } from "vue";
import type { UploadChangeParam, UploadProps } from "ant-design-vue";
import ChooseNetwork from "./components/ChooseNetwork.vue"

function getBase64(img: Blob, callback: (base64Url: string) => void) {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result as string));
  reader.readAsDataURL(img);
}

const fileList = ref([]);
const loading = ref<boolean>(false);
const imageUrl = ref<string>("");
const verseName = ref<string>('');

const handleChange = (info: UploadChangeParam) => {
  if (info.file.status === "uploading") {
    loading.value = true;
    return;
  }
  if (info.file.status === "done") {
    // Get this url from response in real world.
    getBase64(info.file.originFileObj, (base64Url: string) => {
      imageUrl.value = base64Url;
      loading.value = false;
    });
  }

  if (info.file.status === "error") {
    loading.value = false;
    message.error("upload error");
  }
};

const beforeUpload = (file: UploadProps["fileList"][number]) => {
  const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
  if (!isJpgOrPng) {
    message.error("You can only upload JPG file!");
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error("Image must smaller than 2MB!");
  }
  return isJpgOrPng && isLt2M;
};

const upload = () => {
  imageUrl.value = "https://media.istockphoto.com/photos/groups-of-dogs-labrador-puppies-puppy-chocolate-labrador-retriever-in-picture-id1069531070?k=20&m=1069531070&s=612x612&w=0&h=7KhK7ThOXUHiOx9b_TcvT23YdGfSF53AebQrfW4XQYo="
}

</script>

<template>
  <div>
    <h3>Create your verse</h3>
    <div>Upload verse image</div>
    <a-upload
      v-model:file-list="fileList"
      name="avatar"
      list-type="picture-card"
      class="avatar-uploader"
      :show-upload-list="false"
      :customRequest="upload"
      :before-upload="beforeUpload"
      @change="handleChange"
    >
      <img v-if="imageUrl" :src="imageUrl" alt="avatar" />
      <div v-else>
        <loading-outlined v-if="loading"></loading-outlined>
        <plus-outlined v-else></plus-outlined>
        <div class="ant-upload-text">Upload</div>
      </div>
    </a-upload>

    <div>Name your verse</div>
    <a-input v-model:value="verseName" placeholder="ex. Space" />
    <ChooseNetwork />
    <a-button type="primary"> Create </a-button>
  </div>
</template>
