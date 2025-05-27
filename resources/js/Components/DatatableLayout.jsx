import {Card} from "primereact/card";
import React, {useState} from "react";
import {InputText} from "primereact/inputtext";
import {Button} from "primereact/button";

export default function DatatableLayout({title, onReload, onAdd = null, children}) {
    const [search, setSearch] = useState("");

    return (
        <Card title={title} className="p-mt-3">
            <div className="flex justify-content-between">
                <div className="flex gap-2">
                    <InputText
                        value={search}
                        placeholder={`Cari ${title}...`}
                        className="p-inputtext p-component"
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') onReload(search);
                        }}
                    />
                    <Button
                        icon="pi pi-search"
                        onClick={(e) => {
                            e.preventDefault();
                            onReload(search);
                        }}
                    />
                </div>
                {onAdd && (
                    <div>
                        <Button
                            severity="success"
                            icon="pi pi-plus"
                            onClick={onAdd}
                        />
                    </div>
                )}
            </div>
            <div className="mt-3">
                {children}
            </div>
        </Card>
    );
}
