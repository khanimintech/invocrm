export const BACKEND_URL = "http://localhost:8003/api/v1.0/";

export const ITEM_HEIGHT = 48;


export const contractStatuses = [
    { value: 0, label: "Prosesdə"},
    {value: 1, label: "Təsdiqlənib"},
    {value: 2, label: "Vaxtı bitən"},
    {value: 3, label: "2 həftə qalan"}
  ]

export const contractTypes = {
    1: "Alqı-satqı",
    2: "Xidmət",
    3: "Distribyutor",
    4:  "Agent",
    5: "İcarə",
    6: "Bir-dəfəlik",
    7: "Purchase order",
    8: "Beynəlxalq müqavilə",
    9: "Müştəri şablon"
}