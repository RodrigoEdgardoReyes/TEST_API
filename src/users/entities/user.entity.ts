import { Role } from "src/roles/entities/role.entity";
import { BeforeInsert, Column, Entity, ManyToOne, PrimaryGeneratedColumn, RelationId } from "typeorm";
import * as bcrypt from 'bcrypt';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    userName: string;

    @Column({ default: null, nullable: true })
    dui: string;

    @Column({ default: true })
    isActive: boolean;

    @Column()
    password: string;

    @Column()
    email: string;

    @Column({ default: 'na@gmail.com' })
    address: string;

    @ManyToOne(() => Role)
    role: Role
    @RelationId((user: User) => user.role)
    roleId: number


    // TypeORM se ejecuta antes de insertar un nuevo usuario en la base de datos
    @BeforeInsert()
    async hashPassword() {
        this.password = await bcrypt.hash(this.password, 10);
    }

    // Método para verificar la contraseña
    async checkPassword(password: string): Promise<boolean> {
        return bcrypt.compare(password, this.password);
    }
}