
// 表单校验规则由 schema2code 生成，不建议直接修改校验规则，而建议通过 schema2code 生成, 详情: https://uniapp.dcloud.net.cn/uniCloud/schema



const validator = {
  "name": {
    "rules": [
		{
				"required": true,
				"errorMessage": "{label}必填"
			},
      {
        "format": "string"
      }
    ],
    "label": "驾校名称"
  },
  "number": {
    "rules": [
		{
				"required": true,
				"errorMessage": "{label}必填"
			},
      {
        "format": "string"
      }
    ],
    "label": "编号"
  },
  "city": {
    "rules": [
		{
				"required": true,
				"errorMessage": "{label}必填"
			},
      {
        "format": "string"
      }
    ],
    "label": "城市"
  }
}

const enumConverter = {}

export { validator, enumConverter }
