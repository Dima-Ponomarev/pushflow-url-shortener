import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('shortened_url', function (table) {
        table.increments('id').primary();
        table.string('original_url').notNullable();
        table.string('short_id').notNullable().unique();
        table.index('short_id', 'idx_short_id');
    });
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('shortened_url');
}

