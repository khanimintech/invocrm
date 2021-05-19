import React, { useEffect } from 'react';
import { Field, FieldArray } from 'formik';
import Input from '../../components/Input';
import { validateRequired } from '../../utils';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import { Button, IconButton, Tooltip } from '@material-ui/core';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import ClearIcon from '@material-ui/icons/Clear';

const columns = [
    { header: "№", field: "id", type: "text", readOnly: true },
    { header: "Məhsul adı", field: "name", type: "text" },
    { header: "Miqdarı", field: "quantity", type: "number" },
    { header: "Ö.V", field: "unit", type: "select" },
    { header: "Vahidin qiyməti (AZN)", field: "price", type: "number" },
    { header: "Cami qiyməti", field: "total", type: "number", readOnly: true },
]

const CreateAnnex = ({ products, units, readOnly }) => {


    const bodyTemplate = (row, col, arrayHelpers, products, index) => {
        if (col.field === "id" || col.field === "total")
            return <span>{products[index][col.field]}</span>
        return (
            <Field
                name={col.field}
                validate={validateRequired}
                name={`products[${index}].${col.field}`}
            >
                {({ field, form, meta }) => (
                    <Input
                        field={field}
                        form={form}
                        meta={meta}
                        type={col.type}
                        readOnly={col.readOnly}
                        size="small"
                        required
                        readOnly={readOnly}
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
                        <table
                            className="p-datatable p-datatable-responsive p-datatable-gridlines product-table"
                        >
                            <thead className="p-datatable-thead">
                                {
                                    columns.map(col => <th>{col.header}</th>)
                                }
                                {
                                    products.length === 1 || readOnly ? null : (
                                        <th>
                                            <Tooltip title="Sil" placement="top">
                                                <ClearIcon />
                                            </Tooltip>

                                        </th>
                                    )
                                }
                            </thead>
                            <tbody className="p-datatable-tbody">
                                {
                                    products.map((product, index) => (
                                        <tr>
                                            {columns.map(col => (
                                                <td>
                                                    {bodyTemplate(product, col, arrayHelpers, products, index)}
                                                </td>
                                            ))}
                                            {
                                                products.length === 1 ? null : (
                                                    <td>
                                                        <IconButton size="small" className="attach-icon" onClick={() => arrayHelpers.remove(index)} >
                                                            <HighlightOffIcon color="secondary" />
                                                        </IconButton>

                                                    </td>
                                                )
                                            }
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                        <br />
                        {
                            readOnly ? null : (
                                <Button
                                    variant="contained"
                                    color="primary"
                                    startIcon={<AddCircleOutlineIcon />}
                                    onClick={() => arrayHelpers.push({
                                        name: "",
                                        quantity: 0,
                                        unit: 0,
                                        price: "",
                                        total: 0,
                                        id: products[products.length - 1].id + 1,
                                    })}
                                >
                                    Yenisin əlavə et
                        </Button>
                            )
                        }
                    </>
                )}
            />

        </>
    )
}


export default CreateAnnex;