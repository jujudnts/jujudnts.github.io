// Carregar projetos do arquivo JSON
async function loadProjects() {
    try {
        const projectsContainer = document.querySelector('.projects .container');
        
        // Carregar o arquivo JSON
        const response = await fetch('assets/projetos/projects.json');
        if (!response.ok) throw new Error('Erro ao carregar projects.json');
        
        const data = await response.json();
        
        // Processar cada projeto
        data.projects.forEach((project, index) => {
            // Mapear caminhos completos das imagens
            const images = project.images.map(img => 
                `assets/projetos/${project.folder}/${img}`
            );
            
            // Criar e adicionar o card do projeto
            const cardHTML = createProjectCard(project.info, images, index);
            projectsContainer.insertAdjacentHTML('beforeend', cardHTML);
            
            // Adicionar event listeners para o card
            const card = projectsContainer.lastElementChild;
            
            card.querySelector('.btn-view').addEventListener('click', () => {
                updateProjectModal(project.info, images);
                document.getElementById('projectModal').classList.add('is-open');
            });
            
            // Event listener para zoom na imagem
            const projectImage = card.querySelector('.project-image');
            projectImage.addEventListener('click', (e) => {
                if (e.target === projectImage || e.target.tagName === 'IMG') {
                    handleImageZoom(projectImage);
                }
            });
        });
        
    } catch (error) {
        console.error('Erro ao carregar projetos:', error);
        document.querySelector('.projects .container').innerHTML = 
            '<p class="error">Erro ao carregar os projetos. Por favor, tente novamente mais tarde.</p>';
    }
}

// Função para criar o HTML do card do projeto
function createProjectCard(projectInfo, images, index) {
    const coverImage = images[0]; // Primeira imagem como capa
    
    return `
        <article class="project-card" data-project="${String(index + 1).padStart(2, '0')}" data-aos="fade-up">
            <div class="project-text">
                <span class="project-number" data-aos="fade-right" data-aos-delay="100">${String(index + 1).padStart(2, '0')}</span>
                <h2>${projectInfo.titulo || 'Sem título'}</h2>
                <p class="project-location">${projectInfo.ferramentas || ''}</p>
                <p class="project-description">${projectInfo.descricao || ''}</p>
                <button class="btn-view" aria-label="Ver detalhes do projeto">Ver projeto</button>
            </div>
            <div class="project-image">
                <img src="${coverImage}" alt="${projectInfo.titulo || 'Imagem do projeto'}" loading="lazy">
            </div>
        </article>
    `;
}

// Função para atualizar o modal com as informações do projeto
function updateProjectModal(projectInfo, images) {
    const modal = document.getElementById('projectModal');
    
    // Atualizar informações básicas
    modal.querySelector('.modal-number').textContent = projectInfo.numero || '';
    modal.querySelector('.modal-title').textContent = projectInfo.titulo || '';
    modal.querySelector('.modal-location').textContent = projectInfo.ferramentas || '';
    
    // Criar o HTML para a descrição e tags
    const descriptionHTML = `
        <div class="modal-tags">
            ${projectInfo.tags ? `<div class="tag">${projectInfo.tags}</div>` : ''}
            ${projectInfo.ano ? `<div class="tag">${projectInfo.ano}</div>` : ''}
        </div>
        <div class="modal-text">
            ${projectInfo.descricao_completa || projectInfo.descricao || ''}
        </div>
    `;
    
    modal.querySelector('.modal-description').innerHTML = descriptionHTML;
    
    // Atualizar galeria
    const galleryMain = modal.querySelector('.gallery-main');
    const galleryThumbs = modal.querySelector('.gallery-thumbs');
    
    // Criar a galeria principal com link para o zoom
    galleryMain.innerHTML = `
        <a href="${images[0]}" class="zoom-image">
            <img src="${images[0]}" alt="${projectInfo.titulo || ''}" class="modal-image">
        </a>
    `;
    
    // Criar as miniaturas com links para trocar a imagem principal
    galleryThumbs.innerHTML = images.map(img => `
        <a href="#" class="gallery-thumb" data-image="${img}">
            <img src="${img}" alt="${projectInfo.titulo}">
        </a>
    `).join('');
    
    // Inicializar o Magnific Popup para a imagem principal
    $('.zoom-image').magnificPopup({
        type: 'image',
        mainClass: 'mfp-with-zoom',
        closeOnContentClick: false,
        image: {
            verticalFit: true,
            titleSrc: function() {
                return '<div class="zoom-hint"><i class="fa-solid fa-magnifying-glass-plus"></i> Use o mouse para dar zoom</div>';
            }
        },
        zoom: {
            enabled: true,
            duration: 300,
            easing: 'ease-in-out',
            opener: function(openerElement) {
                return openerElement.is('img') ? openerElement : openerElement.find('img');
            }
        },
        callbacks: {
            open: function() {
                // Adicionar classe para mostrar a dica de zoom
                $('.mfp-figure').addClass('show-zoom-hint');
            }
        }
    });
    
    // Adicionar evento para trocar a imagem principal
    $('.gallery-thumb').off('click').on('click', function(e) {
        e.preventDefault();
        const newImage = $(this).data('image');
        
        // Atualizar a imagem principal e seu link de zoom
        galleryMain.innerHTML = `
            <a href="${newImage}" class="zoom-image">
                <img src="${newImage}" alt="${projectInfo.titulo || ''}" class="modal-image">
            </a>
        `;
        
        // Reinicializar o Magnific Popup
        $('.zoom-image').magnificPopup({
            type: 'image',
            mainClass: 'mfp-with-zoom',
            closeOnContentClick: false,
            image: {
                verticalFit: true,
                titleSrc: function() {
                    return '<div class="zoom-hint"><i class="fa-solid fa-computer-mouse"></i> Use o scroll para dar zoom</div>';
                }
            },
            zoom: {
                enabled: true,
                duration: 300,
                easing: 'ease-in-out',
                opener: function(openerElement) {
                    return openerElement.is('img') ? openerElement : openerElement.find('img');
                }
            },
            callbacks: {
                open: function() {
                    // Adicionar classe para mostrar a dica de zoom
                    $('.mfp-figure').addClass('show-zoom-hint');
                }
            }
        });
        
        // Atualizar a miniatura ativa
        $('.gallery-thumb').removeClass('active');
        $(this).addClass('active');
    });
    
    // Ativar a primeira miniatura
    $('.gallery-thumb').first().addClass('active');
    
    // Atualizar link do PDF se existir
    const downloadBtn = modal.querySelector('.btn-download');
    if (projectInfo.pdf) {
        downloadBtn.href = projectInfo.pdf;
        downloadBtn.style.display = 'inline-block';
    } else {
        downloadBtn.style.display = 'none';
    }
}

// Iniciar o carregamento dos projetos quando o DOM estiver pronto
// Variáveis para controle dos projetos
let allProjects = [];
let currentProjectIndex = 0;

// Função para navegar entre projetos
function navigateProject(direction) {
    const newIndex = currentProjectIndex + direction;
    if (newIndex >= 0 && newIndex < allProjects.length) {
        currentProjectIndex = newIndex;
        const project = allProjects[currentProjectIndex];
        const images = project.images.map(img => 
            `assets/projetos/${project.folder}/${img}`
        );
        updateProjectModal(project.info, images);
        updateNavigationButtons();
    }
}

// Atualizar visibilidade dos botões de navegação
function updateNavigationButtons() {
    const modal = document.getElementById('projectModal');
    const prevButton = modal.querySelector('.modal-nav.prev');
    const nextButton = modal.querySelector('.modal-nav.next');
    
    if (prevButton && nextButton) {
        prevButton.style.visibility = currentProjectIndex > 0 ? 'visible' : 'hidden';
        nextButton.style.visibility = currentProjectIndex < allProjects.length - 1 ? 'visible' : 'hidden';
    }
}

// Carregar e exibir os projetos
async function loadProjects() {
    try {
        const projectsContainer = document.querySelector('.projects .container');
        if (!projectsContainer) {
            console.error('Container de projetos não encontrado');
            return;
        }

        // Carregar dados do JSON
        const response = await fetch('assets/projetos/projects.json');
        if (!response.ok) throw new Error('Erro ao carregar projects.json');
        
        const data = await response.json();
        allProjects = data.projects;

        // Limpar o container antes de adicionar novos projetos
        projectsContainer.innerHTML = '';
        
        // Criar cards dos projetos
        allProjects.forEach((project, index) => {
            const images = project.images.map(img => 
                `assets/projetos/${project.folder}/${img}`
            );
            
            const cardHTML = createProjectCard(project.info, images, index);
            projectsContainer.insertAdjacentHTML('beforeend', cardHTML);
            
            const card = projectsContainer.lastElementChild;
            
            // Adicionar event listener para o botão "Ver projeto"
            const btnView = card.querySelector('.btn-view');
            if (btnView) {
                btnView.addEventListener('click', () => {
                    currentProjectIndex = index;
                    updateProjectModal(project.info, images);
                    updateNavigationButtons();
                    const modal = document.getElementById('projectModal');
                    if (modal) {
                        modal.classList.add('is-open');
                        document.body.style.overflow = 'hidden';
                    }
                });
            }

            // Adicionar event listener para zoom na imagem
            const projectImage = card.querySelector('.project-image');
            if (projectImage) {
                projectImage.addEventListener('click', (e) => {
                    if (e.target === projectImage || e.target.tagName === 'IMG') {
                        handleImageZoom(projectImage);
                    }
                });
            }
        });

        // Configurar navegação do modal
        const modal = document.getElementById('projectModal');
        if (modal) {
            const prevButton = modal.querySelector('.modal-nav.prev');
            const nextButton = modal.querySelector('.modal-nav.next');
            const closeButton = modal.querySelector('.modal-close');
            const overlay = modal.querySelector('.modal-overlay');

            if (prevButton) prevButton.addEventListener('click', () => navigateProject(-1));
            if (nextButton) nextButton.addEventListener('click', () => navigateProject(1));
            
            if (closeButton) {
                closeButton.addEventListener('click', () => {
                    modal.classList.remove('is-open');
                    document.body.style.overflow = '';
                });
            }

            if (overlay) {
                overlay.addEventListener('click', (e) => {
                    if (e.target === overlay) {
                        modal.classList.remove('is-open');
                        document.body.style.overflow = '';
                    }
                });
            }
        }
        
    } catch (error) {
        console.error('Erro ao carregar projetos:', error);
        if (projectsContainer) {
            projectsContainer.innerHTML = '<p class="error">Erro ao carregar os projetos. Por favor, tente novamente mais tarde.</p>';
        }
    }
}

// Iniciar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', loadProjects);
