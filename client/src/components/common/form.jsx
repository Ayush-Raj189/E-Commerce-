import React from 'react'
import { Label } from '../ui/label'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../ui/select'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Textarea } from '../ui/textarea'

const CommonForm = ({ 
  formControls, 
  formData, 
  setFormData, 
  onSubmit, 
  buttonText, 
  isButtonDisabled 
}) => {
  const renderInputByComponentType = (getControlItem) => {
    let element = null
    const value = formData[getControlItem.name] || ""

    switch (getControlItem.componentType) {
      case "input":
        element = (
          <Input
            type={getControlItem.type}
            id={getControlItem.name}
            name={getControlItem.name}
            placeholder={getControlItem.placeholder}
            value={value}
            onChange={(e) =>
              setFormData({ ...formData, [getControlItem.name]: e.target.value })
            }
            className="h-10 sm:h-11 text-sm sm:text-base transition-all focus:ring-2 focus:ring-primary"
          />
        )
        break

      case "select":
        element = (
          <Select
            value={value}
            onValueChange={(val) =>
              setFormData({ ...formData, [getControlItem.name]: val })
            }
          >
            <SelectTrigger className="w-full h-10 sm:h-11 text-sm sm:text-base transition-all focus:ring-2 focus:ring-primary">
              <SelectValue placeholder={getControlItem.placeholder} />
            </SelectTrigger>
            <SelectContent>
              {getControlItem.options?.length > 0
                ? getControlItem.options.map((optionItem) => (
                    <SelectItem 
                      key={optionItem.id} 
                      value={optionItem.id}
                      className="text-sm sm:text-base cursor-pointer"
                    >
                      {optionItem.label}
                    </SelectItem>
                  ))
                : null}
            </SelectContent>
          </Select>
        )
        break

      case "textarea":
        element = (
          <Textarea
            id={getControlItem.name}
            name={getControlItem.name}
            placeholder={getControlItem.placeholder}
            value={value}
            onChange={(e) =>
              setFormData({ ...formData, [getControlItem.name]: e.target.value })
            }
            className="min-h-[80px] sm:min-h-[100px] text-sm sm:text-base resize-y transition-all focus:ring-2 focus:ring-primary"
            rows={4}
          />
        )
        break

      default:
        element = (
          <Input
            type={getControlItem.type}
            id={getControlItem.name}
            name={getControlItem.name}
            placeholder={getControlItem.placeholder}
            value={value}
            onChange={(e) =>
              setFormData({ ...formData, [getControlItem.name]: e.target.value })
            }
            className="h-10 sm:h-11 text-sm sm:text-base transition-all focus:ring-2 focus:ring-primary"
          />
        )
        break
    }
    return element
  }

  return (
    <form onSubmit={onSubmit} className="w-full">
      <div className="flex flex-col gap-4 sm:gap-5">
        {formControls.map((ControlItem) => (
          <div className="grid w-full gap-2" key={ControlItem.name}>
            <Label 
              htmlFor={ControlItem.name}
              className="text-sm sm:text-base font-medium text-foreground"
            >
              {ControlItem.label}
              {ControlItem.required && (
                <span className="text-destructive ml-1">*</span>
              )}
            </Label>
            {renderInputByComponentType(ControlItem)}
          </div>
        ))}
      </div>
      <Button 
        disabled={isButtonDisabled} 
        className="mt-5 sm:mt-6 w-full h-10 sm:h-11 text-sm sm:text-base font-semibold transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed" 
        type="submit"
      >
        {buttonText || "Submit"}
      </Button>
    </form>
  )
}

export default CommonForm
