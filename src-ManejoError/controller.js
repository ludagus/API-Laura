import { pool } from "./database.js";

class LibroController{

    async getAll(req, res){
        const [result] = await pool.query('SELECT * FROM libros');
        res.json(result);

    }

    async getOne(req, res){
        try{
            const libro= req.body;
            const [result] = await pool.query(`SELECT * FROM libros WHERE id=(?)`, [libro.id] );
            res.json(result);
        }catch(error){
            console.log(error);
            res.status(404).json({error:'id inexistente'});
        }
    }
//Añadir un nuevo registro
    async add(req, res){
        const libro= req.body;
        const listaAtributos= ['nombre', 'autor','categoria', 'año', 'ISBN'];
        const atributosExtra= Object.keys(libro).filter(attr=> !listaAtributos.includes(attr));

        if(atributosExtra.length>0){
            return res.json({error:`Atributos invalidos: ${atributosExtra.join(',')}`});
        }
        try{  
            const [result]= await pool.query(`INSERT INTO libros(nombre, autor, categoria, año, ISBN) VALUES (?, ?, ?,?,?)`, [libro.nombre, libro.autor, libro.categoria, libro.año, libro.ISBN]);
            res.json({"Id insertado": result.insertId});
        }catch(error){
            console.log('Error al añadir el registro', error);
        }   
    }
  
//Modificar un registro
    async update(req, res){
        const libro= req.body;
        const [result]= await pool.query(`UPDATE libros SET nombre=(?), autor=(?), categoria=(?), año=(?), ISBN=(?) WHERE id=(?)`, [libro.nombre, libro.autor, libro.categoria, libro.año, libro.ISBN, libro.id]);
        res.json({"Registros actualizados": result.changeRows});
    }
//Eliminar un registro
    async delete(req, res){
        const libro= req.body;
        const [result]= await pool.query(`DELETE FROM libros WHERE ISBN=(?)`,  [libro.ISBN]);
        res.json({"Registros eliminado": result.affectedRows});
    }
}
export const libro= new LibroController();