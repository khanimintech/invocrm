import React, { useEffect } from 'react';
import { Field, FieldArray } from 'formik';
import Input from '../../components/Input';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { validateRequired } from '../../utils';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import { Button, IconButton } from '@material-ui/core';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';


const columns = [
    { header: "№", field: "id", type: "text", readOnly: true },
    { header: "Məhsul adı", field: "name", type: "text" },
    { header: "Miqdarı", field: "quantity", type: "number" },
    { header: "Ö.V", field: "unit", type: "select" },
    { header: "Vahidin qiyməti (AZN)", field: "price", type: "number" },
    { header: "Cami qiyməti", field: "total", type: "number", readOnly: true },
]

const CreateAnnex = ({ products, units }) => {


    const bodyTemplate = (row, col, arrayHelpers, products) => {
        const index = row.id;
        return (
            <Field
                name={col.field}
                validate={validateRequired}
                name={`products[${index}].${col.field}`}
            >
                {({ field, form, meta }) => (
                    <Input
                        field={{ ...field, value: col.field === "id" ? (index + 1).toString() : field.value }}
                        form={form}
                        meta={meta}
                        type={col.type}
                        readOnly={col.readOnly}
                        size="small"
                        select={col.field === "unit"}
                        options={units.map(unit => ({ label: unit.name, value: unit.id }))}
                        onChange={val => {
                            if (col.field === "price" || col.field === "quantity")
                                form.setFieldValue(field.name, val < 0 ? 0 : val)
                            if (col.field === "price") {
                                form.setFieldValue(`products[${index}].total`, val * (+products[index].quantity))

                            }
                            if (col.field === "quantity") {
                                form.setFieldValue(`products[${index}].total`, +products[index].price * val)
                            }
                            else form.setFieldValue(field.name, val)
                        }}
                    />
                )}
            </Field>
        )
    }

    return (
        <>
            <FieldArray
                validate={validateRequired}
                name="products"
                render={arrayHelpers => (
                    <>
                    <DataTable
                        value={products}
                        className="p-datatable p-datatable-responsive p-datatable-gridlines"
                    >

                        {columns.map((col) => {
                            return (
                                <Column
                                    key={col.header}
                                    field={col.field}
                                    body={(rowData) => bodyTemplate(rowData, col, arrayHelpers, products)}
                                    header={col.header}
                                />
                            )
                        }
                        )}
                        {
                            products.length === 1 ? null :(
                                <Column
                                body={(row) => <HighlightOffIcon  color="secondary" onClick={() => arrayHelpers.remove(row.id)}  />}
                                header={"Sil"}
                            />
                            )
                        }
                       
                    </DataTable>
                    <Button
                variant="contained"
                color="primary"
                startIcon={<AddCircleOutlineIcon />}
                onClick={() =>  arrayHelpers.push({
                    name: "",
                    quantity: 0,
                    unit: 0,
                    price: "",
                    total: 0,
                    id: products[products.length -1].id +1,
                })}
            >
                Yenisin əlavə et
                </Button>
                    </>
                )}
            />
           
        </>
    )
}


export default CreateAnnex;