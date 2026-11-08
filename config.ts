export const LK_TZ = "Asia/Colombo";

export const config = {
	// Empty means the website uses its own hosting address, including a Pages subpath.
	baseUrl: "",
	fileNameWithExt: "vu-25.3-y2.xlsx",
	worksheetName: "2nd YEAR Cyber",
	summaryCell: "A1",
	dataStartIndex: 3,
	weekDaysArr: [3, 4, 5, 6, 7],
	timeColumn: 2,
	modules: {
		NIT2102: "Cyber Security Essentials",
		NIT2171: "Introduction to ICT Management",
		NIT2122: "Server Administration and Management",
		NIT2141: "Digital Forensics and Ethical Hacking",
	},
	degrees: ["BIT-CYBER"],
	degreeNames: {
		"BIT-CYBER": "VU Bachelor of Information Technology — Cyber Security (25.3, Year 2)",
	},
	degreeModules: {
		"BIT-CYBER": ["NIT2102", "NIT2171", "NIT2122", "NIT2141"],
	},
};
