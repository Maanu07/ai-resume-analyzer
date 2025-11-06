import { useState } from 'react'
import Dropzone from 'react-dropzone' // third party library for drag and drop file upload
import { formatFileSize } from '~/lib/utils'

type FileUploaderProps = {
  onFileSelect?: (file: File | null) => void
}

const FileUploader = ({ onFileSelect }: FileUploaderProps) => {
  const [key, setKey] = useState(0)

  function handleDrop(acceptedFiles: File[]) {
    const file = acceptedFiles[0] || null
    onFileSelect?.(file)
  }

  const maxFileSize = 20 * 1024 * 1024 // 20MB in bytes

  return (
    <div className="w-full gradient-border">
      <Dropzone
        key={key}
        onDrop={handleDrop}
        multiple={false}
        accept={{ 'application/pdf': ['.pdf'] }}
        maxSize={maxFileSize}
      >
        {({ getRootProps, getInputProps, acceptedFiles, fileRejections }) => {
          const file = acceptedFiles[0] || null
          const fileTooLarge = fileRejections.length > 0

          return (
            <div {...getRootProps()}>
              <input {...getInputProps()} />

              <div className="space-y-4 cursor-pointer">
                {file ? (
                  <div
                    className="uploader-selected-file"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <img src="/images/pdf.png" alt="pdf" className="size-10" />
                    <div className="flex items-center space-x-3">
                      <div>
                        <p className="text-lg text-gray-700 font-medium truncate">
                          {file.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {formatFileSize(file.size)}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="p-2 cursor-pointer"
                      onClick={(e) => {
                        onFileSelect?.(null)
                        setKey(key + 1) // update the key to re-render the component Dropzone
                      }}
                    >
                      <img
                        src="/icons/cross.svg"
                        alt="remove"
                        className="w-4 h-4"
                      />
                    </button>
                  </div>
                ) : (
                  <div>
                    <div className="mx-auto w-16 h-16 flex items-center justify-center">
                      <img
                        src="/icons/info.svg"
                        alt="upload"
                        className="size-20"
                      />
                    </div>

                    <p className="text-lg text-gray-500">
                      <span className="font-semibold">Click to upload</span> or
                      drag and drop
                    </p>
                    <p className="text-sm text-gray-500">
                      PDF (max {formatFileSize(maxFileSize)})
                    </p>
                    {fileTooLarge && (
                      <p className="text-sm text-red-500">File is too large</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          )
        }}
      </Dropzone>
    </div>
  )
}

export default FileUploader
