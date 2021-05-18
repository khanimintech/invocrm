export const BACKEND_URL = process.env.NODE_ENV === "development" ? "http://localhost:8003/api/v1.0/" : "/api/v1.0/";

export const ITEM_HEIGHT = 48;

export const contractStatuses = [
    { value: 0, label: "Prosesdə"},
    {value: 1, label: "Təsdiqlənib"},
    {value: 2, label: "Vaxtı bitən"},
    {value: 3, label: "Vaxtı bitir"}
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

export const companyTypes = [
  { label: "MMC", value: 1 },
  { label: "ASC", value: 2 },
  { label: "QSC", value: 3 },
]