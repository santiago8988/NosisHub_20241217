"use client"

import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { toast } from 'react-toastify'
import { completeEntrieAction, createNextEntrie, getEntryAction } from "@/app/_actions";
import InputForm from "./InputForm";
import ConfirmationModal from "@/app/components/entries/ConfirmationModal";
import { useSession } from "next-auth/react";
import { Card, CardHeader, CardContent, CardFooter } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Textarea } from "../../../components/ui/textarea";

const EntrieForm = () => {
    const router = useRouter()
    const { id } = useParams();
    const { data: session } = useSession()
    const [entrie, setEntrie] = useState({})
    const formRef = useRef(null);
    const [modalShow, setModalShow] = useState(false);
    const [confirm, setConfirm] = useState(false);
    const [action, setAction] = useState('')
    const [isLoading, setIsLoading] = useState(false);
    const [record, setRecord] = useState({})
    const [formulasToCalculate, setFormulasToCalculate] = useState([])
    const [updatedFormObject, setUpdatedFormObject] = useState({});
    const [formValues, setFormValues] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            const data = await getEntryAction(id)
            setEntrie(data)
            setRecord(data.record)
            setFormValues(data.values)
        }
        fetchData()
    }, [id])

    useEffect(() => {
        if (record) {
            const { own } = record
            own && typeof own === 'object' && Object?.keys(own)?.map((campo) => {
                if (own[campo].tipo === 'formula') {
                    setFormulasToCalculate((prevFormulas) => ({
                        ...prevFormulas,
                        [campo]: own[campo],
                    }));
                }
            })
        }
    }, [record])

    useEffect(() => {
        if (confirm) {
            setIsLoading(true);
            const complete = async () => {
                const form = formRef.current;
                const formData = new FormData(form);
                const formObject = Object.fromEntries(formData.entries());
                const response = await completeEntrieAction(id, formObject, action, session.user.email)

                if (response && response.completed === true) {
                    toast('Your entrie has been completed successfully.', {
                        theme: 'dark',
                        type: 'success',
                        autoClose: 3000
                    })

                    if (!response.nextCreated) {
                        const newEntrie = await createNextEntrie(response, entrie?.record?.identifier, entrie?.record?.periodicity, entrie?.record?.type);

                        if (newEntrie && newEntrie._id) {
                            toast('Your entrie has been created successfully.', {
                                theme: 'dark',
                                type: 'success',
                                autoClose: 3000
                            })
                        }
                    }

                    setTimeout(() => {
                        router.push(`/inicio`);
                        setConfirm(false)
                        setIsLoading(false)
                    }, 3000);

                } else if (response && response.completed === false) {
                    toast('Tu entrada ha sido editada correctamente.', {
                        theme: 'dark',
                        type: 'success',
                        autoClose: 2500
                    })
                    setTimeout(() => {
                        router.push(`/entrie/${id}`);
                        setConfirm(false)
                        setIsLoading(false)
                    }, 3000)
                }
            }
            complete();
        }
    }, [confirm]);


    const validateFormObject = (formObject) => {
        for (const key in formObject) {
            if (formObject.hasOwnProperty(key)) {
                const value = formObject[key];
                if (typeof value !== 'object' && !(value instanceof File)) {
                    if (value.trim() === '') {
                        return false;
                    }
                }
            }
        }
        return true;
    }

    const handleModal = () => {
        setModalShow(!modalShow);
    }

    const handleConfirm = () => {
        setConfirm(true)
        handleModal();
    };

    const calculateFormulas = (e) => {
        e.preventDefault();
        const form = formRef.current;
        const formData = new FormData(form);
        const formObject = Object.fromEntries(formData.entries());
        const updatedForm = { ...formObject };

        for (const key in formulasToCalculate) {
            if (formulasToCalculate.hasOwnProperty(key)) {
                const formulaInfo = formulasToCalculate[key];
                const formula = formulaInfo.formula;
                const keys = Object.keys(formObject);
                const values = Object.values(formObject);
                const replacedFormula = keys.reduce(
                    (acc, cur, index) => acc.replace(new RegExp(cur, 'g'), values[index]),
                    formula
                );
                try {
                    const calculatedValue = eval(replacedFormula);
                    updatedForm[key] = formulaInfo.resultado === 'number' ? Number(calculatedValue) : calculatedValue;
                } catch (error) {
                    console.error(`Error al evaluar la fórmula para ${key}: ${error.message}`);
                    updatedForm[key] = 'Error en la fórmula';
                }
            }
        }
        setUpdatedFormObject(updatedForm);
    };

    const handleInputChange = (label, value) => {
        setFormValues((prevFormValues) => ({
            ...prevFormValues,
            [label]: value,
        }));
    };

    const handleSubmit = async (e, act) => {
        e.preventDefault();
        const form = formRef.current;
        const formData = new FormData(form);
        const formObject = Object.fromEntries(formData.entries());

        if (act === 'completar') {
            const isFormValid = validateFormObject(formObject);
            if (!isFormValid) {
                toast('Debe llenar todos los campos para poder completar la entrada.', {
                    theme: 'dark',
                    type: 'error',
                    autoClose: 3000
                })
                return
            }
            setModalShow(true);
        } else if (act === 'guardar') { setConfirm(true) };
    }


    return (
        <Card className="w-full max-w-4xl mx-auto mt-8">
            <CardHeader>
                <h1 className="text-3xl font-bold text-center">
                    {entrie && (!entrie?.isActive || entrie?.completed) ? "Ver medición" : "Completar medición"}
                </h1>
            </CardHeader>
            <CardContent>
                {(entrie && (!entrie?.isActive || entrie?.completed)) ? (
                    <div>
                        <form ref={formRef} className="space-y-4">
                            {entrie.record && Object.keys(entrie.record.own).map((campo) => (
                                <InputForm
                                    key={campo}
                                    campo={entrie.record.own[campo]}
                                    label={campo}
                                    type={entrie.record.own[campo].tipo}
                                    action='view'
                                    values={entrie.values[campo]}
                                    identifier={[]}
                                    formValues={entrie?.values}
                                    onInputChange={handleInputChange}
                                />
                            ))}
                        </form>
                        {entrie.comment && (
                            <div className="mt-4">
                                <Textarea
                                    name="comment"
                                    id="comment"
                                    defaultValue={entrie.comment}
                                    readOnly
                                    className="w-full h-32"
                                />
                            </div>
                        )}
                    </div>
                ) : (
                    <div>
                        <form ref={formRef} className="space-y-4">
                            {entrie.record && Object?.keys(entrie.record.own)?.map((campo) => {
                                const fieldValue = updatedFormObject[campo] ? updatedFormObject[campo] : entrie.values[campo];
                                return (
                                    <InputForm 
                                        key={campo}
                                        campo={entrie?.record?.own[campo]} 
                                        label={campo} 
                                        type={entrie?.record?.own[campo]?.tipo} 
                                        action='edit' 
                                        values={fieldValue} 
                                        identifier={entrie?.record?.identifier}
                                        formValues={entrie?.values}
                                        onInputChange={handleInputChange}
                                    /> 
                                );
                            })}
                        </form>
                    </div>
                )}
            </CardContent>
            <CardFooter className="flex justify-between">
                {(entrie && (!entrie?.isActive || entrie?.completed)) ? (
                    <Link href={`/record/${entrie?.record?._id}`}>
                        <Button variant="outline">Volver</Button>
                    </Link>
                ) : (
                    <>
                        <Button
                            onClick={(e) => { handleSubmit(e, "completar"); setAction('completar'); }}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Cargando...' : 'Completar'}
                        </Button>
                        <Button
                            onClick={(e) => { handleSubmit(e, "guardar"); setAction('guardar'); }}
                            disabled={isLoading}
                            variant="outline"
                        >
                            {isLoading ? 'Cargando...' : 'Guardar'}
                        </Button>
                    </>
                )}
            </CardFooter>
            <ConfirmationModal 
                isOpen={modalShow} 
                onClose={handleModal} 
                onConfirm={handleConfirm} 
                title='Completar entrada' 
                message='Esta acción no puede ser deshecha. Confirmar?'
            />
        </Card>
    );
}

export default EntrieForm;