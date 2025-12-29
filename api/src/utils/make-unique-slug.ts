import slugify from 'slugify'; 
import { Model, ModelStatic, Op } from 'sequelize';

export async function makeUniqueSlug(model: ModelStatic<Model & { slug: string }>, title: string): Promise<string> {
    const slugBase = slugify(title, { lower: true, strict: true });

    let iteration = 1;
    let slug = slugBase;

    const sameSlugs = await model.findAll({
        attributes: ['slug'],
        where: {
            slug: {
                [Op.like]: `${slugBase}%`,
            },
        },
        raw: true,
    });

    const takenSlugs = sameSlugs.map((item) => item.slug);

    while (takenSlugs.includes(slug)) {
        slug = `${slugBase}-${iteration++}`;
    }

    return slug;
}
