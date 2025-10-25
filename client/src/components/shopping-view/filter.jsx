import React, { Fragment } from 'react'
import { filterOptions } from '../config'
import { Label } from '../ui/label'
import { Checkbox } from '../ui/checkbox'
import { SelectSeparator } from '../ui/select'


const ProductFilter = ({ filters, handleFilter }) => {
    return (
        <div className="bg-background rounded-lg shadow-sm">
            <div className="p-4 border-b">
                <h2 className="text-lg font-extrabold">Filters</h2>
            </div>
            <div className='p-4 space-y-4'>
                {
                    Object.keys(filterOptions).map(KeyItem => <Fragment key={KeyItem}>
                        <div>
                            <h3 className='text-base font-bold' >{KeyItem}</h3>
                            <div className='grid gap-2 mt-2'>
                                {
                                    filterOptions[KeyItem].map(options => <Label key={options.id} className='flex items-center gap-2 font-medium'>
                                        <Checkbox checked={
                                            filters &&
                                            Object.keys(filters).length > 0 &&
                                            filters[KeyItem] &&
                                            filters[KeyItem].indexOf(options.id) > -1
                                        }
                                            onCheckedChange={() => handleFilter(KeyItem, options.id)} />
                                        {options.label}

                                    </Label>)
                                }
                            </div>
                        </div>
                        <SelectSeparator />
                    </Fragment>)
                }

            </div>
        </div>
    )
}

export default ProductFilter