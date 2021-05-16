import React, { useEffect } from 'react';
import { Field, FieldArray } from 'formik';
import Input from '../../components/Input';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { validateRequired } from '../../utils';


const columns = [
    { header: "№", field: "id", type: "text", readOnly: true },
    { header: "Məhsul adı", field: "name", type: "text" },
    { header: "Miqdarı", field: "quantity", type: "number" },
    { header: "Ö.V", field: "unit", type: "select" },
    { header: "Vahidin qiyməti (AZN)", field: "price", type: "number" },
    { header: "Cami qiyməti", field: "total", type: "number", readOnly: true },
]

const CreateAnnex = ({ products, units }) => {


    const bodyTemplate = (row, col, index, arrayHelpers) => {
        return (
            <Field
                name={col.field}
                validate={validateRequired}
            >
                {({ field, form, meta }) => (
                    <Input
                        field={{ ...field, value: col.field === "id" ? (index + 1 ).toString() : field.value }}
                        form={form}
                        meta={meta}
                        type={col.type}
                        readOnly={col.readOnly}
                        size="small"
                    />
                )}
            </Field>
        )
    }

    return (
 
            <FieldArray
                validate={validateRequired}
                name="products"
                render={arrayHelpers => (
                    <DataTable
                        value={products}
                        className="p-datatable p-datatable-responsive p-datatable-gridlines"
                    >
        
                        {columns.map((col, index) => {
                            return (
                                <Column
                                    key={col.header}
                                    field={col.field}
                                    body={(rowData) => bodyTemplate(rowData, col, index, arrayHelpers)}
                                    header={col.header}
                                />
                            )
                        }
                    )}
    
                 </DataTable>
                )}
            />
       
    )
}


export default CreateAnnex;