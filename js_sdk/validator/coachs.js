
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
    "label": "姓名"
  },
  "student": {
    "rules": [
      {
        "format": "string"
      }
    ],
    "label": "学生"
  },
  "company": {
    "rules": [
		{
				"required": true,
				"errorMessage": "{label}必填"
			},
      {
        "format": "string"
      }
    ],
    "label": "驾校"
  },
  "phone": {
    "rules": [
		{
				"required": true,
				"errorMessage": "{label}必填"
			},
      {
        "format": "string"
      },
      {
        "pattern": "^\\+?[0-9-]{3,20}$"
      }
    ],
    "label": "手机号码"
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
  "month": {
    "rules": [
      {
        "format": "int"
      }
    ],
    "label": "月份"
  },
  "keyi_exam_sum": {
    "rules": [
      {
        "format": "int"
      }
    ],
    "label": "考试人数"
  },
  "keer_sum": {
    "rules": [
      {
        "format": "int"
      }
    ],
    "label": "人数"
  },
  "keer_exam_sum": {
    "rules": [
      {
        "format": "int"
      }
    ],
    "label": "考试人数"
  },
  "kesan_sum": {
    "rules": [
      {
        "format": "int"
      }
    ],
    "label": "人数"
  },
  "keer_rate": {
    "rules": [
      {
        "format": "int"
      }
    ],
    "label": "及格率"
  },
  "kesan_exam_sum": {
    "rules": [
      {
        "format": "int"
      }
    ],
    "label": "考试人数"
  },
  "students_sum": {
    "rules": [
      {
        "format": "int"
      }
    ],
    "label": "报名人数"
  }
}

const enumConverter = {}

export { validator, enumConverter }
