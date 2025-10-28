class CommonAttributes {
    name: string = "";
    state: boolean = false;
    id: string = "";
}

export class AccordionStructure extends CommonAttributes {
    child: Child[] = [];
}

export class Child extends CommonAttributes {
    child?: Child[] = [];
    list?: List[] = []
}

class List extends CommonAttributes {

}

//[{ name: "Promesa1", state: true, child: [{ name: "seguridad", state: false, list: [{ name: "eliminar", state: true }, { name: "guardar", state: false }, { name: "buscar", state: true }] }], }, { name: "Promesa", state: true, child: [{ name: "seguridad", state: false, list: [{ name: "eliminar", state: true }, { name: "guardar", state: false }, { name: "buscar", state: true }] }] }, { name: "Promesa 2", state: true, child: [{ name: "seguridad 2", state: false, list: [{ name: "eliminar", state: true }, { name: "guardar", state: false }, { name: "buscar", state: true }] }] },]