<template>
        <textarea :id="id" :value="value">
        </textarea>
</template>
<script>
// Import TinyMCE
import tinymce from "tinymce/tinymce";
import "tinymce/themes/modern/theme";
import "tinymce/plugins/paste";
import "tinymce/plugins/link";
import "tinymce/plugins/template";
const INIT = 0;
const CHANGED = 2;
var EDITOR = null;
export default {
  props: {
    value: {
      type: String,
      required: true
    },
    setting: {}
  },
  watch: {
    value: function(val) {
      console.log("init " + val);
      if (this.status == INIT || tinymce.activeEditor.getContent() != val) {
        tinymce.activeEditor.setContent(val);
      }
      this.status = CHANGED;
    }
  },
  data: function() {
    return {
      status: INIT,
      id: "editor-" + new Date().getMilliseconds()
    };
  },
  methods: {},
  mounted: function() {
    const _this = this;
    const setting = {
      selector: "#" + _this.id,
      language: "zh_CN",
      language_url: "static/langs/zh_CN.js",
      skin_url: "static/skins/lightgray",
      init_instance_callback: function(editor) {
        EDITOR = editor;
        console.log("Editor: " + editor.id + " is now initialized.");
        editor.on("input change undo redo", () => {
          var content = editor.getContent();
          _this.$emit("input", content);
        });
      },
    };
    Object.assign(setting, _this.setting);
    tinymce.init(setting);
  },
  beforeDestroy: function() {
    tinymce.get(this.id).destroy();
  }
};
</script>
