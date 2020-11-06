package com.example.fileserver.service;


import com.example.fileserver.model.File;
import com.example.fileserver.repository.FileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.stream.Stream;

@Service
public class FileStorageService {

    private FileRepository fileRepository;

    public FileStorageService(final FileRepository fileRepository) {
        this.fileRepository = fileRepository;
    }

    public File store(MultipartFile file) throws IOException {
        String fileName = StringUtils.cleanPath(file.getOriginalFilename());
        File toStore = new File(fileName,file.getContentType(), file.getBytes());
        return fileRepository.save(toStore);
    }

    public File getFile(String id){
        return fileRepository.findById(id).get();
    }

    public Stream<File> getAllFiles(){
        return fileRepository.findAll().stream();
    }

}
