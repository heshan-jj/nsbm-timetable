export const LK_TZ = "Asia/Colombo";

export const config = {
	// Empty means the website uses its own hosting address, including a Pages subpath.
	baseUrl: "",
	sourceUrl: "https://nsbm365.sharepoint.com/:x:/g/SOC/IQDhIbZmFWZmSpbHiek_EkwwAXoXUu5D0ezXkIkE7BoBrlQ?e=xDbeYn",
	fileNameWithExt: "soc-26.3-y1-s1.xlsx",
	worksheetName: "26.3  Timetable",
	summaryCell: "B4",
	dataStartIndex: 7,
	weekDaysArr: [3, 4, 5, 6, 7, 8],
	timeColumn: 2,
	modules: {
		"CS101.2": "Introduction to Computer Science",
		"CS102.3": "Programming Fundamentals",
		"MA101.3": "Mathematics for Computing",
		"CS105.3": "Database Management Systems",
		"AI1102.2": "Fundamentals of Artificial Intelligence",
		"CS103.2": "Personal Development & Communication Skills",
		MGT1104: "Introduction to Sustainability Development",
	},
	degrees: ["SOC-26.3"],
	degreeNames: {
		"SOC-26.3": "Faculty of Computing — 26.3, Year 1 Semester 1",
	},
	degreeModules: {
		"SOC-26.3": ["CS101.2", "CS102.3", "MA101.3", "CS105.3", "AI1102.2", "CS103.2", "MGT1104"],
	},
};
