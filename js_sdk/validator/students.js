// 表单校验规则由 schema2code 生成，不建议直接修改校验规则，而建议通过 schema2code 生成, 详情: https://uniapp.dcloud.net.cn/uniCloud/schema



const validator = {
	"name": {
		"rules": [{
				"required": true,
				"errorMessage": "{label}必填"
			},
			{
				"format": "string"
			}
		],
		"label": "姓名"
	},
	"kemu": {
		"rules": [{
				"required": true,
				"errorMessage": "{label}必填"
			},
			{
				"format": "string"
			}
		],
		"label": "科目"
	},
	"year": {
		"rules": [
			{
				"required": true,
				"errorMessage": "{label}必填"
			},
			{
				"format": "int"
			}
		],
		"label": "年份"
	},
	"month_exam": {
		"rules": [
			{
				"required": true,
				"errorMessage": "{label}必填"
			},
			{
				"format": "string"
			}
		],
		"label": "月份"
	},
	"month": {
		"rules": [
			{
				"required": true,
				"errorMessage": "{label}必填"
			},
			{
				"format": "int"
			}
		],
		"label": "月份"
	},
	"day_exam": {
		"rules": [
			{
				"required": true,
				"errorMessage": "{label}必填"
			},
			{
				"format": "string"
			}
		],
		"label": "日期"
	},
	"day": {
		"rules": [
			{
				"required": true,
				"errorMessage": "{label}必填"
			},
			{
				"format": "int"
			}
		],
		"label": "日期"
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
	"coach": {
		"rules": [{
				"required": true,
				"errorMessage": "{label}必填"
			},
			{
				"format": "string"
			}
		],
		"label": "教练"
	},
	"card": {
		"rules": [
			{
				"format": "string"
			},
			{
				"pattern": "^\\+?[0-9-]{15,18}$"
			}
		],
		"label": "身份证"
	},
	"mobile": {
		"rules": [{
				"required": true,
				"errorMessage": "{label}必填"
			},
			{
				"format": "string"
			},
			{
				"pattern": "^\\+?[0-9-]{11}$"
			}
		],
		"label": "手机号码"
	}

}

const enumConverter = {}

export {
	validator,
	enumConverter
}
