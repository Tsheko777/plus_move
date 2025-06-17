import { Link } from '@inertiajs/react';

interface Linker {
    url: string;
    label: string;
    active: boolean;
}

interface PaginationProps {
    links: Linker[];
}

export const Pagination = ({ links }: PaginationProps) => {
    return (
        <div className="my-4 join">
            {links &&
                links.length > 0 &&
                links.map((val: Linker, key: number) => {
                    if (val.url)
                        return (
                            <Link key={key} href={val.url}>
                                <input
                                    checked={val.active}
                                    className="btn join-item btn-square"
                                    type="radio"
                                    name="options"
                                    aria-label={containsVar(val.label)}
                                />
                            </Link>
                        );

                    <input
                        key={key}
                        checked={val.active}
                        className="btn join-item btn-square"
                        type="radio"
                        name="options"
                        aria-label={containsVar(val.label)}
                    />;
                })}
        </div>
    );
};

const containsVar = (input: string) => {
    if (input)
        if (input.includes('Next')) {
            return '>';
        }
    if (input.includes('Previous')) {
        return '<';
    }
    return input;
};
